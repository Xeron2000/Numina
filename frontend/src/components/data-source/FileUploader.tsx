import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploaderProps {
  onUpload: (files: File[]) => void;
}

export default function FileUploader({ onUpload }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="p-4 border-2 border-dashed rounded-lg cursor-pointer">
      <input {...getInputProps()} />
      <p className="text-center">拖拽文件到此区域或点击上传</p>
    </div>
  );
}