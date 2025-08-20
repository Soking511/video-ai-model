from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from video_summarizer import VideoSummarizer

app = Flask(__name__)
CORS(app)

# Configuration
API_KEY = "bebd8d99b51541c2b759408582638201.I96D4wNrv2q5VHEm"
API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions"

summarizer = VideoSummarizer(API_KEY, API_URL)

@app.route('/api/summarize', methods=['POST'])
def summarize_video():
    try:
        data = request.get_json()

        if not data or 'video_url' not in data:
            return jsonify({'error': 'Video URL is required'}), 400

        video_url = data['video_url']
        prompt = data.get('prompt', 'Summarize this video in key points')

        # Validate URL format
        if not video_url.startswith(('http://', 'https://')):
            return jsonify({'error': 'Invalid URL format'}), 400

        # Process the video
        summary = summarizer.summarize_video(video_url, prompt)

        return jsonify({
            'success': True,
            'summary': summary,
            'video_url': video_url
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Video Summarizer API is running'})

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        'message': 'Video Summarizer API',
        'endpoints': {
            'POST /api/summarize': 'Summarize a video',
            'GET /api/health': 'Health check'
        }
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
