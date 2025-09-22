import formidable from 'formidable';
import FormData from 'form-data';
import fs from 'fs';
import fetch from 'node-fetch'; // node-fetch가 package.json에 있는지 확인하세요. 없다면 추가해야 합니다.

const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

// Vercel에서 Body-parser를 비활성화하는 설정입니다.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!IMGBB_API_KEY) {
    return res.status(500).json({ message: 'Imgbb API 키가 서버에 설정되지 않았습니다.' });
  }

  const form = formidable({});

  try {
    const [fields, files] = await form.parse(req);
    const imageFile = files.image?.[0];

    if (!imageFile) {
      return res.status(400).json({ message: '이미지 파일이 필요합니다.' });
    }

    // imgbb에 업로드
    const formData = new FormData();
    formData.append('key', IMGBB_API_KEY);
    formData.append('image', fs.createReadStream(imageFile.filepath));
    
    const uploadResponse = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const uploadResult = await uploadResponse.json();

    if (!uploadResponse.ok || !uploadResult.success) {
      throw new Error(uploadResult.error?.message || 'imgbb 업로드에 실패했습니다.');
    }

    return res.status(200).json({ imageUrl: uploadResult.data.url });

  } catch (error) {
    console.error('[upload] error:', error);
    return res.status(500).json({ message: '이미지 업로드 중 오류가 발생했습니다.', error: error.message });
  }
}
