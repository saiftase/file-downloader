export type Status = "available" | "scheduled"

export default interface File {
    name: string;
    device: string;
    path: string;
    status: Status;
}