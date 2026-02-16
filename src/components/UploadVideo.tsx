import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export default function UploadVideo({ ownerAuthId }: { ownerAuthId: string }) {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `videos/${fileName}`;

    // رفع الفيديو إلى Storage
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(filePath, file);

    if (error) {
      console.error('Upload error:', error);
      return;
    }

    // إضافة سجل في جدول haraka_files
    const { error: dbError } = await supabase
      .from('haraka_files')
      .insert([
        {
          owner_auth_id: ownerAuthId,
          bucket: 'videos',
          path: filePath,
          size: file.size,
          mime_type: file.type,
        }
      ]);

    if (dbError) console.error('DB insert error:', dbError);
    else console.log('Video uploaded and record added!');
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload}>Upload Video</button>
    </div>
  );
}
