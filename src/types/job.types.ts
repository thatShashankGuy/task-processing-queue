export type Job = {
  id?: string;
  type: string;
  payload: any;
  status: Status;
  retryCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Status = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
