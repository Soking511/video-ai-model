
import os
import base64
import requests
import tempfile
import yt_dlp
from PIL import Image
import cv2
from typing import List, Dict
import io

class VideoSummarizer:
    def __init__(self, api_key: str, api_url: str):
        """
        تهيئة ملخص الفيديو باستخدام GLM-4.5V

        Args:
            api_key: مفتاح API للوصول إلى نموذج GLM-4.5V
            api_url: رابط API للنموذج
        """
        self.api_key = api_key
        self.api_url = api_url
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }

    def download_video(self, video_url: str) -> str:
        """
        تحميل الفيديو من الرابط المحدد

        Args:
            video_url: رابط الفيديو

        Returns:
            مسار الملف المحمل
        """
        temp_dir = tempfile.mkdtemp()
        video_path = os.path.join(temp_dir, "downloaded_video.mp4")

        ydl_opts = {
            'outtmpl': video_path,
            'format': 'best[ext=mp4]',
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([video_url])
            return video_path
        except Exception as e:
            raise Exception(f"فشل تحميل الفيديو: {str(e)}")

    def extract_frames(self, video_path: str, num_frames: int = 10) -> List[Image.Image]:
        """
        استخراج إطارات من الفيديو باستخدام OpenCV

        Args:
            video_path: مسار ملف الفيديو
            num_frames: عدد الإطارات المراد استخراجها

        Returns:
            قائمة بكائنات الصور المستخرجة
        """
        frames_dir = tempfile.mkdtemp()
        frame_paths = []

        try:
            video = cv2.VideoCapture(video_path)
            total_frames = int(video.get(cv2.CAP_PROP_FRAME_COUNT))

            interval = max(1, total_frames // num_frames)

            frame_count = 0
            extracted_frames = []

            while video.isOpened() and len(extracted_frames) < num_frames:
                ret, frame = video.read()
                if not ret:
                    break

                if frame_count % interval == 0:
                    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    pil_image = Image.fromarray(frame_rgb)
                    extracted_frames.append(pil_image)

                frame_count += 1

            video.release()
            return extracted_frames
        except Exception as e:
            raise Exception(f"فشل استخراج الإطارات: {str(e)}")

    def image_to_base64(self, image: Image.Image) -> str:
        """
        تحويل الصورة إلى صيغة base64

        Args:
            image: كائن الصورة

        Returns:
            الصورة مشفرة بصيغة base64
        """
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG")
        return base64.b64encode(buffered.getvalue()).decode('utf-8')

    def summarize_video(self, video_url: str, prompt: str = "لخص هذا الفيديو في نقاط رئيسية") -> str:
        """
        تلخيص الفيديو باستخدام GLM-4.5V

        Args:
            video_url: رابط الفيديو
            prompt: النص الموجه للنموذج

        Returns:
            ملخص الفيديو
        """
        video_path = self.download_video(video_url)

        try:
            frames = self.extract_frames(video_path)

            messages = [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                    ]
                }
            ]

            for frame in frames:
                encoded_image = self.image_to_base64(frame)
                messages[0]["content"].append({
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{encoded_image}"
                    }
                })

            payload = {
                "model": "glm-4.5v",
                "messages": messages,
                "max_tokens": 1000
            }

            response = requests.post(self.api_url, headers=self.headers, json=payload)

            if response.status_code == 200:
                result = response.json()
                return result["choices"][0]["message"]["content"]
            else:
                return f"خطأ في الطلب: {response.status_code} - {response.text}"
        finally:
            if os.path.exists(video_path):
                os.remove(video_path)
                os.rmdir(os.path.dirname(video_path))

if __name__ == "__main__":
    API_KEY = "bebd8d99b51541c2b759408582638201.I96D4wNrv2q5VHEm"
    API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions"

    summarizer = VideoSummarizer(API_KEY, API_URL)

    video_url = input("أدخل رابط الفيديو الذي تريد تلخيصه: ")

    print("جاري تحليل الفيديو وتلخيصه... قد يستغرق هذا بعض الوقت.")
    summary = summarizer.summarize_video(
        video_url,
        "لخص هذا الفيديو في نقاط رئيسية باللغة العربية"
    )

    print("\nملخص الفيديو:")
    print(summary)

