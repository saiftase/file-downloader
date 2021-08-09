import React from 'react';
import './FileList.css';
import File from '../../types/File'
import GetAppIcon from '@material-ui/icons/GetApp';
import { useState, useEffect } from 'react';

interface FileListProps {
  files: File[];
}

const FileList: React.FC<FileListProps> = ({files} : FileListProps) => {

  let checkboxRefs: (HTMLInputElement | null)[] = [];
  let checkboxAllRef: HTMLInputElement | null;
  const [checks, setChecks] = useState<{[key:string]: boolean}>({})

  const updateCheckAllVisualState = () => {
    if(checkboxAllRef){
      const numChecked = listChecked().length;
      if(numChecked === 0){
        checkboxAllRef.checked = false;
        checkboxAllRef.indeterminate = false;
      }else if(numChecked < files.length){
        checkboxAllRef.checked = true; // Not strictly neccesary, but added to ensure consistent behavior.
        checkboxAllRef.indeterminate = true;
      }else {
        checkboxAllRef.checked = true;
        checkboxAllRef.indeterminate = false;
      }
    }
  }

  useEffect( () => {
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
      if(checkbox){
        checkbox.checked = state;
      }
    })
  }

  const handleCheckAll = () => {
    if(listChecked().length > 0){
      setChecks({});
      toggleAll(false)
    }else{
      const allFiles: {[key:string]: boolean} = {}
      files.forEach( file => {
        allFiles[`${file.device}@${file.path}`] = true;
      }) 
      setChecks(allFiles);
      toggleAll(true);
    }
  }

  const handleDownload = () => {
    const downloadString = listChecked().reduce((acc, cv) => {
      return acc + cv[0] + "\n";
    }, "The following files will be downloaded:\n")
    console.log("dl", downloadString)
    alert(downloadString);
  }
  

  return (
    <div className="list">
      <div>
        <input type="checkbox"  onChange={handleCheckAll} ref={node => { checkboxAllRef = node; }} id="checkbox-all" value="all"/>
        <span>Selected: </span>
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
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => {
            return (
              <tr key={file.name}>
                <td><input type="checkbox" ref={node => { checkboxRefs.push(node); }} onChange={handleCheck} id={file.name} value={`${file.device}@${file.path}`} /></td>
                <td>{file.name}</td>
                <td>{file.device}</td>
                <td>{file.path}</td>
                <td className="status">{file.status}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}

export default FileList;