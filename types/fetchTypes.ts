export type list = {
  data: Record<string, any>[];
  maxPage: number;
  totalRows: number;
};

export type fetchList = {
  pending: boolean;
  data: list;
};

export type fetchItem = {
  pending: any;
  data: Record<string, any>;
};

export type fetchResult = {
  pending: any;
  data: {
    type: string;
    message?: string;
    validations?: [];
  };
};
