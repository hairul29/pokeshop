import { useRef } from 'react';
import { App as AntApp, Upload } from 'antd';
import type { UploadFile } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { fileToResizedDataUrl } from '../utils/image';

interface Props {
  value?: string[];
  onChange?: (value: string[]) => void;
  max?: number;
}

/** Form-compatible image picker. Stores resized images as data URLs (fine for localStorage). */
export default function ImageUploader({ value = [], onChange, max = 1 }: Props) {
  const { message } = AntApp.useApp();
  const latest = useRef(value);
  latest.current = value;

  const fileList: UploadFile[] = value.map((url, i) => ({ uid: String(i), name: `image-${i + 1}`, status: 'done', url }));

  const handleBefore = async (file: File) => {
    try {
      const url = await fileToResizedDataUrl(file);
      latest.current = [...latest.current, url].slice(0, max);
      onChange?.(latest.current);
    } catch {
      message.error('That image could not be processed. Try a JPG or PNG.');
    }
    return Upload.LIST_IGNORE;
  };

  return (
    <Upload
      accept="image/*"
      listType="picture-card"
      multiple={max > 1}
      fileList={fileList}
      beforeUpload={handleBefore}
      onRemove={(file) => {
        const index = fileList.findIndex((f) => f.uid === file.uid);
        onChange?.(value.filter((_, i) => i !== index));
      }}
    >
      {value.length < max && (
        <div><PlusOutlined /><div style={{ marginTop: 6 }}>Upload</div></div>
      )}
    </Upload>
  );
}
