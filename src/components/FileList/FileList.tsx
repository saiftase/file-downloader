import React from 'react';
import './FileList.css';
import File from '../../types/File'
import GetAppIcon from '@material-ui/icons/GetApp';
import { useState, useEffect } from 'react';
import { FiberManualRecord } from '@material-ui/icons';

interface FileListProps {
  files: File[];
}

const FileList: React.FC<FileListProps> = ({files} : FileListProps) => {

  let checkboxRefs: (HTMLInputElement | null)[] = [];
  let checkboxAllRef: HTMLInputElement | null;
  const [checks, setChecks] = useState<{[key:string]: boolean}>({})

  const getFileString = (file: File) => {
    return `${file.device}@${file.path}`;
  }

  const getAvailableFiles = () => {
    return files.filter(file => file.status === "available")
  }

  const updateCheckAllVisualState = () => {
    if(checkboxAllRef){
      const numChecked = listChecked().length;
      if(numChecked === 0){
        checkboxAllRef.checked = false;
        checkboxAllRef.indeterminate = false;
      }else if(numChecked < getAvailableFiles().length){
        checkboxAllRef.checked = true; // Not strictly neccesary, but added to ensure consistent behavior.
        checkboxAllRef.indeterminate = true;
      }else {
        checkboxAllRef.checked = true;
        checkboxAllRef.indeterminate = false;
      }
    }
  }

  useEffect(() => {
    updateCheckAllVisualState();
  })

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) =>{
    const selectedFilePath = event.target.value;
    if(checks[selectedFilePath]){
      setChecks({
        ...checks,
        [selectedFilePath]: false
      })
    }else{
      setChecks({
        ...checks,
        [selectedFilePath]: true
      })
    }
  }

  const listChecked = () => {
    const checked = Object.entries(checks).filter(element => {
      if(element[1]){
        return element;
      }
    })
    return checked;
  }

  const toggleAll = (state: boolean) => {
    checkboxRefs.forEach(checkbox => {
      if(checkbox && !checkbox.disabled){
        checkbox.checked = state;
      }
    })
  }

  const handleCheckAll = () => {
    if(listChecked().length === getAvailableFiles().length){
      setChecks({});
      toggleAll(false)
    }else{
      const allFiles: {[key:string]: boolean} = {}
      getAvailableFiles().forEach( file => {
        allFiles[getFileString(file)] = true;
      }) 
      setChecks(allFiles);
      toggleAll(true);
    }
  }

  const handleDownload = () => {
    const downloadString = listChecked().reduce((acc, cv) => {
      return acc + cv[0] + "\n";
    }, "The following files will be downloaded:\n")
    alert(downloadString);
  }

  return (
    <div className="list">
      <div className="controls">
        <input type="checkbox"  onChange={handleCheckAll} ref={node => { checkboxAllRef = node; }} id="checkbox-all" value="all"/>
        <span className="number-selected-label">Selected {listChecked().length}</span>
        <button onClick={handleDownload}>
          <GetAppIcon />
          Download Selected
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Device</th>
            <th>Path</th>
            <th className="status">Status</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => {
            return (
              <tr key={file.name} className={checks[getFileString(file)] ? 'selected' : ''}>
                <td><input type="checkbox" disabled={file.status !== "available"} ref={node => { checkboxRefs.push(node); }} onChange={handleCheck} id={file.name} value={getFileString(file)} /></td>
                <td>{file.name}</td>
                <td>{file.device}</td>
                <td>{file.path}</td>
                <td className="status">
                  {file.status === "available" && <FiberManualRecord  className="indicator"/>}
                  {file.status}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}

export default FileList;