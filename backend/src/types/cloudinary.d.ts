declare module 'cloudinary' {
  export const v2: {
    config(options: {
      cloud_name: string;
      api_key: string;
      api_secret: string;
    }): void;

    uploader: {
      upload(path: string, options?: any): Promise<any>;
      destroy(public_id: string, options?: any): Promise<any>;
    };
  };

  export function config(options: {
    cloud_name: string;
    api_key: string;
    api_secret: string;
  }): void;

  export const uploader: {
    upload(path: string, options?: any): Promise<any>;
    destroy(public_id: string, options?: any): Promise<any>;
  };
} 