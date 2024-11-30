class MissAVClass extends WebApiBase {
    constructor() {
        super();
        this.webSite = 'https://missav.com';
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        };
    }

    /**
     * 获取分类列表
     * @param {UZArgs} args
     * @returns {Promise<RepVideoClassList>}
     */
    async getClassList(args) {
        let webUrl = args.url || this.webSite;
        let backData = new RepVideoClassList();

        try {
            const response = await req(webUrl, { headers: this.headers });
            backData.error = response.error;

            if (response.data) {
                const document = parse(response.data);
                const classElements = document.querySelectorAll('.relative nav .py-1 a');

                let classList = [];
                classElements.forEach(element => {
                    const typeUrl = element.getAttribute('href') ?? '';
                    const typeName = element.text.trim();

                    if (typeUrl && typeName) {
                        const videoClass = new VideoClass();
                        videoClass.type_id = typeUrl;
                        videoClass.type_name = typeName;
                        classList.push(videoClass);
                    }
                });

                backData.data = classList;
            }
        } catch (error) {
            backData.error = `获取分类列表失败：${error.message}`;
        }

        return JSON.stringify(backData);
    }

    /**
     * 获取视频列表
     * @param {UZArgs} args
     * @returns {Promise<RepVideoList>}
     */
    async getVideoList(args) {
        let listUrl = `${args.url}?page=${args.page}`;
        let backData = new RepVideoList();

        try {
            const response = await req(listUrl, { headers: this.headers });
            backData.error = response.error;

            if (response.data) {
                const document = parse(response.data);
                const videoElements = document.querySelectorAll('.pb-12 .thumbnail');

                let videoList = [];
                videoElements.forEach(element => {
                    const vodId = element.querySelector('.my-2 .text-secondary')?.getAttribute('href') ?? '';
                    const vodPic = element.querySelector('img')?.getAttribute('data-src') ?? '';
                    const vodName = element.querySelector('.my-2 .text-secondary')?.text.trim() ?? '';
                    const vodRemarks = element.querySelector('span')?.text.trim() ?? '';

                    if (vodId && vodName) {
                        const video = new Video();
                        video.vod_id = vodId;
                        video.vod_pic = vodPic;
                        video.vod_name = vodName;
                        video.vod_remarks = vodRemarks;
                        videoList.push(video);
                    }
                });

                backData.data = videoList;
            }
        } catch (error) {
            backData.error = `获取视频列表失败：${error.message}`;
        }

        return JSON.stringify(backData);
    }

    /**
     * 搜索视频
     * @param {UZArgs} args
     * @returns {Promise<RepVideoList>}
     */
    async searchVideos(args) {
        let searchUrl = `${this.webSite}/search?q=${encodeURIComponent(args.query)}&page=${args.page}`;
        let backData = new RepVideoList();

        try {
            const response = await req(searchUrl, { headers: this.headers });
            backData.error = response.error;

            if (response.data) {
                const document = parse(response.data);
                const videoElements = document.querySelectorAll('.pb-12 .thumbnail');

                let videoList = [];
                videoElements.forEach(element => {
                    const vodId = element.querySelector('.my-2 .text-secondary')?.getAttribute('href') ?? '';
                    const vodPic = element.querySelector('img')?.getAttribute('data-src') ?? '';
                    const vodName = element.querySelector('.my-2 .text-secondary')?.text.trim() ?? '';
                    const vodRemarks = element.querySelector('span')?.text.trim() ?? '';

                    if (vodId && vodName) {
                        const video = new Video();
                        video.vod_id = vodId;
                        video.vod_pic = vodPic;
                        video.vod_name = vodName;
                        video.vod_remarks = vodRemarks;
                        videoList.push(video);
                    }
                });

                backData.data = videoList;
            }
        } catch (error) {
            backData.error = `搜索视频失败：${error.message}`;
        }

        return JSON.stringify(backData);
    }

    /**
     * 获取视频详情
     * @param {UZArgs} args
     * @returns {Promise<RepVideoDetail>}
     */
    async getVideoDetail(args) {
        const detailUrl = args.url;
        let backData = new RepVideoDetail();

        try {
            const response = await req(detailUrl, { headers: this.headers });
            backData.error = response.error;

            if (response.data) {
                const document = parse(response.data);

                const videoDetail = new VideoDetail();
                videoDetail.vod_content = document.querySelector('.text-secondary')?.text.trim() ?? '';
                videoDetail.vod_pic = document.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? '';
                videoDetail.vod_name = document.querySelector('.mt-4 h1')?.text.trim() ?? '';
                videoDetail.vod_play_url = `${detailUrl}#`;

                backData.data = videoDetail;
            }
        } catch (error) {
            backData.error = `获取视频详情失败：${error.message}`;
        }

        return JSON.stringify(backData);
    }

    /**
     * 获取视频播放地址
     * @param {UZArgs} args
     * @returns {Promise<RepVideoPlayUrl>}
     */
    async getVideoPlayUrl(args) {
        const url = args.url;
        let backData = new RepVideoPlayUrl();

        try {
            const response = await req(url, { headers: this.headers });
            backData.error = response.error;

            if (response.data) {
                const uuidMatch = response.data.match(/sixyik\.com\\\/(.+?)\\\/seek\\\/_0\.jpg/);
                const uuid = uuidMatch ? uuidMatch[1] : null;

                if (uuid) {
                    backData.data = `https://surrit.com/${uuid}/playlist.m3u8`;
                } else {
                    backData.error = '未找到视频播放地址';
                }
            }
        } catch (error) {
            backData.error = `获取视频播放地址失败：${error.message}`;
        }

        return JSON.stringify(backData);
    }
}
let missavInstance = new MissAVClass();
