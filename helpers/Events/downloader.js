/*!-======[ Module Imports ]======-!*/
const axios = 'axios'.import();

/*!-======[ Function Imports ]======-!*/
const { mediafireDl } = await (fol[0] + 'mediafire.js').r();
const youtubeScraper = await (fol[0] + 'youtubescraper.js').r();
const { processMedia } = await './toolkit/ffmpeg.js'.r();
const fs = 'fs'.import();

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
  let infos = Data.infos;
  let { func } = Exp;
  let { archiveMemories: memories } = func;
  let { sender, id } = cht;

// =======[ INSTAGRAM DOWNLOADER ]=======
  ev.on(
    {
      cmd: ['instagramdl', 'ig', 'igdl', 'instagram'],
      listmenu: ['instagramdl'],
      tag: 'downloader',
      urls: {
        msg: true,
        formats: ['instagram'],
      },
      energy: 5,
    },
    async ({ urls }) => {
      const _key = keys[sender];
      await cht.edit('```Processing Instagram...```', _key);
      
      try {
        const encodedUrl = encodeURIComponent(urls[0]);
        const apiUrl = `https://api.fikmydomainsz.xyz/download/instagram?url=${encodedUrl}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (!data.status || !data.result || !data.result.length) {
          return cht.edit('❌ Gagal mendapatkan media Instagram', _key);
        }
        
        const mediaItems = data.result;
        
        let text = '*!-======[ INSTAGRAM ]======-!*\n';
        text += `\nCreator: ${data.creator || 'N/A'}`;
        text += `\nTotal Media: ${mediaItems.length}`;
        text += `\nURL: ${urls[0]}`;
        text += `\nAPI: api.fikmydomainsz.xyz`;
        
        const firstMedia = mediaItems[0];
        const info = {
          text,
          contextInfo: {
            externalAdReply: {
              title: cht.pushName,
              body: 'Instagram Downloader',
              thumbnailUrl: firstMedia.thumbnail,
              sourceUrl: urls[0],
              mediaUrl: firstMedia.url_download,
              renderLargerThumbnail: true,
              showAdAttribution: true,
              mediaType: 1,
            },
            forwardingScore: 19,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterName: 'Termai',
              newsletterJid: '120363301254798220@newsletter',
            },
          },
        };
        
        await Exp.sendMessage(id, info, { quoted: cht.reaction || cht });
        await cht.edit(`\`\`\`Sending ${mediaItems.length} media...\`\`\``, _key);
        
        for (let i = 0; i < mediaItems.length; i++) {
          const media = mediaItems[i];
          const isVideo = media.kualitas?.toLowerCase().includes('video');
          const isPhoto = media.kualitas?.toLowerCase().includes('photo');
          
          if (isVideo) {
            await Exp.sendMessage(
              id,
              { 
                video: { url: media.url_download }, 
                mimetype: "video/mp4",
                caption: `📹 Instagram Video\n${media.kualitas || ''}\n(${i + 1}/${mediaItems.length})`
              },
              { quoted: cht.reaction || cht }
            );
          } else if (isPhoto) {
            await Exp.sendMessage(
              id,
              { 
                image: { url: media.url_download },
                caption: `📷 Instagram Photo\n${media.kualitas || ''}\n(${i + 1}/${mediaItems.length})`
              },
              { quoted: cht.reaction || cht }
            );
          } else {
            await Exp.sendMessage(
              id,
              { 
                document: { url: media.url_download },
                mimetype: 'application/octet-stream',
                fileName: `instagram_media_${i + 1}.${isVideo ? 'mp4' : 'jpg'}`,
                caption: `📎 Instagram Media\n${media.kualitas || ''}\n(${i + 1}/${mediaItems.length})`
              },
              { quoted: cht.reaction || cht }
            );
          }
          
          if (i < mediaItems.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        await cht.edit(`✅ Success - ${mediaItems.length} media sent`, _key);
        
      } catch (e) {
        console.error('Error pada igdl:', e);
        await cht.edit(`❌ Instagram download gagal.\nError: ${e.message}`, _key);
      }
    }
  );
  
  ev.on(
    {
      cmd: ['pinterestdl', 'pindl'],
      listmenu: ['pinterestdl'],
      tag: 'downloader',
      urls: {
        formats: ['pinterest', 'pin'],
        msg: true,
      },
      energy: 7,
    },
    async ({ urls }) => {
      await cht.reply('```Processing...```');
      try {
        const api = await fetch(
          `https://api.deline.web.id/downloader/pinterest?url=${encodeURIComponent(urls[0])}`
        ).then(r => r.json());

        if (!api.status) {
          return cht.reply('Status API false');
        }

        const res = api?.result;
        const type = res.video ? 'Video' : (res.image && res.image !== 'Tidak ada' ? 'Image' : '-');
        const valid = v => typeof v === 'string' && v !== 'Tidak ada';

        let text = '*!-======[ PINTEREST ]======-!*\n';
        text += `\nLink: ${res.original_url}`;
        text += `\nType: ${type}`;
        if (res.title && res.title !== 'Tidak ada') text += `\nTitle: ${res.title}`;

        if (valid(res?.video) || valid(res?.image)) {
          await Exp.sendMessage(
            id,
            valid(res?.video)
              ? { video: { url: res.video }, caption: text, mimetype: 'video/mp4' }
              : { image: { url: res.image }, caption: text },
            { quoted: cht.reaction || cht }
          );
        } else {
          return cht.reply('Media tidak ditemukan');
        }
      } catch (e) {
        console.error('Error pada pindl:', e);
        await cht.reply(`Error: ${e.message}`);
      }
    }
  );

  ev.on(
    {
      cmd: ['mediafire', 'mediafiredl'],
      listmenu: ['mediafire'],
      tag: 'downloader',
      urls: {
        formats: ['mediafire'],
        msg: true,
      },
      energy: 75,
    },
    async ({ urls }) => {
      const _key = keys[sender];

      await cht.edit('```Processing...```', _key);
      try {
        let m = await mediafireDl(urls[0]);
        let { headers } = await axios.get(m.link);
        let type = headers['content-type'];
        await cht.edit('Sending...', _key);
        await Exp.sendMessage(
          id,
          { document: { url: m.link }, mimetype: type, fileName: m.title },
          { quoted: cht.reaction || cht }
        );
      } catch (e) {
        await cht.edit('TypeErr: ' + e, _key);
      }
    }
  );

  // =======[ TIKTOK DOWNLOADER ]=======
  ev.on(
    {
      cmd: [
        'tiktok',
        'tiktokdl',
        'tt',
        'ttaudio',
        'tiktokaudio',
        'ttvn',
        'tiktokvn',
      ],
      listmenu: ['tiktok', 'tiktokaudio'],
      tag: 'downloader',
      urls: {
        formats: ['tiktok', 'douyin'],
        msg: true,
      },
      energy: 5,
    },
    async ({ urls }) => {
      const _key = keys[sender];
      await cht.edit('```Processing TikTok...```', _key);
      let isAudio = /^(vn|audio)/.test(cht.cmd);
      
      try {
        const tikwmResponse = await axios.post(
          'https://tikwm.com/api/',
          {
            url: urls[0],
            count: 12,
            cursor: 0,
            web: 1,
            hd: 1
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Linux; Android 10)',
              'Referer': 'https://tikwm.com/'
            }
          }
        );
        
        if (tikwmResponse.data.code !== 0) {
          throw new Error('Gagal mengambil data dari TikTok');
        }
        
        const res = tikwmResponse.data.data;
        
        if (!res.hdplay && !res.play) {
          throw new Error('Video tidak tersedia untuk download');
        }
        
        let videoUrl = '';
        if (res.hdplay) {
          videoUrl = 'https://tikwm.com' + res.hdplay;
        } else if (res.play) {
          videoUrl = 'https://tikwm.com' + res.play;
        }
        
        const createTime = res.create_time 
          ? new Date(res.create_time * 1000).toLocaleString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          : 'N/A';
        
        const rawSize = res.hd_size || res.size || 0;
        const sizeText = rawSize >= 1024 * 1024
          ? (rawSize / 1024 / 1024).toFixed(2) + ' MB'
          : (rawSize / 1024).toFixed(2) + ' KB';
        
        let text = '*!-======[ TIKTOK ]======-!*\n';
        text += `\nTitle: ${res.title || 'N/A'}`;
        text += `\nAccount: ${res.author?.nickname || 'N/A'}`;
        text += `\nUsername: @${res.author?.unique_id || 'N/A'}`;
        text += `\nLikes: ${res.digg_count?.toLocaleString() || 0}`;
        text += `\nComments: ${res.comment_count?.toLocaleString() || 0}`;
        text += `\nShares: ${res.share_count?.toLocaleString() || 0}`;
        text += `\nDuration: ${res.duration || 'N/A'}`;
        text += `\nSize: ${sizeText}`;
        text += `\nRegion: ${res.region || 'N/A'}`;
        text += `\nUploaded: ${createTime}`;
        
        const info = {
          text,
          contextInfo: {
            externalAdReply: {
              title: cht.pushName,
              body: 'TikTok Downloader',
              thumbnailUrl: res.cover,
              sourceUrl: urls[0],
              mediaUrl: videoUrl,
              renderLargerThumbnail: true,
              mediaType: 2,
            },
            forwardingScore: 19,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterName: 'Termai',
              newsletterJid: '120363301254798220@newsletter',
            },
          },
        };
        
        await Exp.sendMessage(id, info, { quoted: cht });
        
        if (!isAudio && videoUrl) {
          await cht.edit('```Downloading video...```', _key);
          
          try {
            const videoBuffer = await axios.get(videoUrl, {
              responseType: 'arraybuffer',
              headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10)',
                'Referer': 'https://tikwm.com/'
              }
            }).then(response => response.data);
            
            await cht.edit('```Sending video...```', _key);
            
            await Exp.sendMessage(
              id,
              {
                video: videoBuffer,
                mimetype: 'video/mp4',
                caption: `📹 ${res.title || 'TikTok Video'}`,
                fileName: `tiktok_${Date.now()}.mp4`
              },
              { quoted: cht }
            );
          } catch (videoError) {
            console.error('Error sending video:', videoError);
            await cht.edit('```Sending as document...```', _key);
            await Exp.sendMessage(
              id,
              {
                document: { url: videoUrl },
                mimetype: 'video/mp4',
                fileName: `tiktok_${Date.now()}.mp4`,
                caption: `📹 ${res.title || 'TikTok Video'} (Sent as document)`
              },
              { quoted: cht }
            );
          }
        }
        
        if (res.music_info?.play) {
          await cht.edit('```Sending audio...```', _key);
          
          try {
            const audioUrl = res.music_info.play;
            await Exp.sendMessage(
              id,
              {
                audio: { url: audioUrl },
                mimetype: 'audio/mpeg',
                ptt: cht.cmd.includes('vn'),
                fileName: `tiktok_audio_${Date.now()}.mp3`
              },
              { quoted: cht.reaction || cht }
            );
          } catch (audioError) {
            console.error('Error sending audio:', audioError);
            await cht.edit('❌ Gagal mengirim audio', _key);
          }
        }
        
        await cht.edit('✅ Success', _key);
        
      } catch (e) {
        console.error('Error pada tiktokdl:', e);
        await cht.edit(`❌ TikTok download gagal.\nError: ${e.message}`, _key);
      }
    }
  );

  ev.on(
    {
      cmd: ['spotify', 'spotdl', 'spodl'],
      listmenu: ['spotify'],
      tag: 'downloader',
      urls: {
        formats: ['spotify.com', 'open.spotify.com'],
        msg: true,
      },
      energy: 15,
    },
    async ({ urls }) => {
      const _key = keys[sender];
      await cht.edit(infos.messages.wait, _key);
      
      try {
        const url = await fetch(
          `https://api.danzy.web.id/api/download/spotify?url=${encodeURIComponent(urls[0])}`
        ).then(r => r.json());

        if (!url.status || !url.data) {
          return cht.edit('Track tidak ditemukan', _key);
        }

        const data = url.data;
        let duration = data.trackDuration || 0;
        let m = Math.floor((duration % 3600) / 60);
        let s = duration % 60;
        
        let text = '*!-======[ Spotify🎵 ]======-!*\n';
        text += `\nTrack: ${data.trackName || 'N/A'}`;
        text += `\nAlbum: ${data.albumName || 'N/A'}`;
        text += `\nAlbumReleaseDate: ${data.albumReleaseDate || 'N/A'}`;
        text += `\nArtists: ${data.artists ? data.artists.join(', ') : 'N/A'}`;
        text += `\nTrackDuration: ${m + ':' + s}`;
        text += `\nTrackPopularity: ${data.trackPopularity || 'N/A'}`;
        text += `\nTrackUrl: ${data.trackUrl || urls[0]}`;
        
        const info = {
          text,
          contextInfo: {
            externalAdReply: {
              title: cht.pushName,
              body: 'Spotify Downloader',
              thumbnailUrl: data.albumImageUrl,
              sourceUrl: 'https://github.com/Rifza123',
              mediaUrl:
                'http://ẉa.me/6283110928302/' +
                Math.floor(Math.random() * 100000000000000000),
              renderLargerThumbnail: true,
              mediaType: 1,
            },
            forwardingScore: 19,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterName: 'Termai',
              newsletterJid: '120363301254798220@newsletter',
            },
          },
        };
        
        await Exp.sendMessage(id, info, { quoted: cht });
        await cht.edit(infos.messages.sending, _key);
        
        if (data.downloadUrl) {
          await Exp.sendMessage(
            id,
            { audio: { url: data.downloadUrl }, mimetype: 'audio/mpeg' },
            { quoted: cht.reaction || cht }
          );
        }
      } catch (e) {
        console.error('Error pada spotify:', e);
        await cht.edit(`Error: ${e.message}`, _key);
      }
    }
  );

  ev.on(
    {
      cmd: ['rednote', 'renotedl', 'xiaohongshu'],
      listmenu: ['rednote', 'xiaohongshu'],
      tag: 'downloader',
      urls: {
        formats: ['xhslink.com', 'xiaohongshu.com'],
        msg: true,
      },
      energy: 5,
    },
    async ({ urls }) => {
      const _key = keys[sender];
      await cht.edit(infos.messages.wait, _key);

      try {
        const response = await fetch(
          `https://api.deline.web.id/downloader/xiaohongshu?url=${encodeURIComponent(urls[0])}`
        );
        const res = await response.json();
        
        if (!res.status || !res.result) {
          return cht.reply('Gagal mengambil data Rednote/Xiaohongshu');
        }
        
        let data = res.result;
        let text = '*!-======[ Rednote/Xiaohongshu ]======-!*\n';
        text += `\nTitle: ${data.title || 'N/A'}`;
        text += `\nAccount: ${data.user?.nickName || 'N/A'}`;
        text += `\nLikes: ${data.interactInfo?.likedCount || 0}`;
        text += `\nComments: ${data.commentCountL1 || 0}`;
        text += `\nPostTime: ${func.dateFormatter(data.time || Date.now(), 'Asia/Jakarta')}`;
        
        const info = {
          text,
          contextInfo: {
            externalAdReply: {
              title: cht.pushName,
              body: 'Rednote Downloader',
              thumbnailUrl: data.images?.[0]?.url || data.cover,
              sourceUrl: 'https://github.com/Rifza123',
              mediaUrl:
                'http://ẉa.me/6283110928302/' +
                Math.floor(Math.random() * 100000000000000000),
              renderLargerThumbnail: true,
              mediaType: 1,
            },
            forwardingScore: 19,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterName: 'Termai',
              newsletterJid: '120363301254798220@newsletter',
            },
          },
        };
        
        await Exp.sendMessage(id, info, { quoted: cht });
        await cht.edit(infos.messages.sending, _key);
        
        let type = data.type;
        if (type == 'image' && data.images) {
          for (let image of data.images) {
            await Exp.sendMessage(
              id,
              { image: { url: image.url } },
              { quoted: cht.reaction || cht }
            );
          }
        } else if (type == 'video' && data.video?.url) {
          await Exp.sendMessage(
            id,
            { video: { url: data.video.url } },
            { quoted: cht.reaction || cht }
          );
        }
      } catch (e) {
        console.error('Error pada rednote:', e);
        await cht.edit(`Error: ${e.message}`, _key);
      }
    }
  );
  ev.on(
    {
      cmd: [
        'ytmp3',
        'ytm4a',
        'play',
        'ytmp4',
        'playvn',
        'dlvlink',
        'yts',
        'ytsearch',
      ],
      listmenu: ['ytmp3', 'ytm4a', 'play', 'ytmp4'],
      tag: 'downloader',
      badword: true,
      args: 'Harap sertakan url/judul videonya!',
      energy: 5,
    },
    async ({ args, urls }) => {
      const _key = keys[sender];
      let isDl = cht.cmd == 'dlvlink';
      let isYts = ['yts', 'ytsearch', 'play'].includes(cht.cmd);
      let q = urls?.[0] || args || null;
      let [dlink, json] = args.split('|||||');
      let item = json ? JSON.parse(json) : {};
      if (!q) return cht.reply('Harap sertakan url/judul videonya!');
      try {
        if (!isDl) {
          await cht.edit('Searching...', _key);
          let search = (
            await fetch(
              `${api.xterm.url}/api/search/youtube?query=${q}&key=${api.xterm.key}`
            ).then((a) => a.json())
          ).data;
          item = search.items[0];
          if (cfg.button && isYts) {
            let imageMessage = await func.uploadToServer(item.thumbnail);
            let paramJson = {
              title: `🔎Click and see all search results➡️`,
              has_multiple_buttons: true,
              sections: search.items.map((v, i) => ({
                title: `#${i + 1}. ${v.title}`,
                highlight_label: `${v.duration}`,
                rows: [
                  {
                    title: 'Download Audio/M4A 🎵',
                    description: 'Audio Biasa',
                    id: `.ytm4a ${v.url}`,
                  },
                  {
                    title: 'Download Audio/WAV 🎙️',
                    description: 'Voice Note',
                    id: `.playvn ${v.url}`,
                  },
                  {
                    title: 'Download Audio/MP4 📹',
                    description: 'Video',
                    id: `.ytmp4 ${v.url}`,
                  },
                  {
                    title: 'Download Audio/MP3 💽',
                    description: 'Audio MP3 (dalam bentuk dokumen)',
                    id: `.ytmp3 ${v.url}`,
                  },
                ],
              })),
            };

            let _m = {
              interactiveMessage: {
                header: {
                  title: '',
                  imageMessage,
                  hasMediaAttachment: true,
                },
                body: {
                  text: `🔍 YouTube Search\n${item.title}`.font('bold'),
                },

                footer: {
                  text: `👤 Channel: ${item.author?.name}\n⏱ Duration: ${item.duration}\n📅 Rilis: ${item.publishedAt}\n👁️ Views: ${item.viewCount.toLocaleString()}\n🔗 ${item.url}`,
                },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: 'single_select',
                      buttonParamsJson: '{"has_multiple_buttons":true}',
                    },
                    {
                      name: 'single_select',
                      buttonParamsJson: paramJson.String(),
                    },
                  ],
                },
                contextInfo: {
                  stanzaId: cht.key.id,
                  participant: cht.key.participant,
                  quotedMessage: cht,
                },
              },
            };

            return Exp.relayMessage(cht.id, _m, {});
          }
        }
        let data = (
          await fetch(
            api.xterm.url +
              '/api/downloader/youtube?key=' +
              api.xterm.key +
              '&url=https://www.youtube.com/watch?v=' +
              item.id +
              '&type=' +
              (cht.cmd === 'ytmp4' ? 'mp4' : 'mp3')
          ).then((a) => a.json())
        ).data;

        if (cfg.button && !isDl && cht.cmd == 'ytmp4') {
          let downloads = data?.downloads || [];
          let imageMessage = await func.uploadToServer(data.thumb);
          let paramJson = {
            title: `📥 Pilih format download`,
            has_multiple_buttons: true,
            sections: [
              {
                title: `🎬 Video (MP4)`,
                rows: downloads.map((v) => ({
                  title:
                    `${v.resolution} ${v.ext.toUpperCase()} ${v.hasAudio ? '🔊' : ''}`.trim(),
                  description: `ITag: ${v.format_id} • FPS: ${v.fps} • ${v.note || ''}`,
                  id: `.dlvlink ${v.dlink}|||||${JSON.stringify(item)}`,
                })),
              },
            ],
          };

          // compose interactive message
          let _m = {
            interactiveMessage: {
              header: {
                title: '',
                imageMessage,
                hasMediaAttachment: true,
              },
              body: {
                text: `🎞 ${data.caption}`.font('bold'),
              },
              footer: {
                text: `⏱ Durasi: ${data.duration}\n📺 Source: YouTube\n🔗 ${data.link}`,
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: 'single_select',
                    buttonParamsJson: '{"has_multiple_buttons":true}',
                  },
                  {
                    name: 'single_select',
                    buttonParamsJson: paramJson.String(),
                  },
                ],
              },
              contextInfo: {
                stanzaId: cht.key.id,
                participant: cht.key.participant,
                quotedMessage: cht,
              },
            },
          };

          return Exp.relayMessage(cht.id, _m, {});
        }

        await cht.edit('Downloading...', _key);

        let saved = isDl
          ? await func.saveToFile(dlink + '&isBaileys=true')
          : false;
        isDl && (await cht.edit('Converting...', _key));
        let converted = saved
          ? await processMedia(saved, ['-c:v', 'libx264', '-an'], 'mp4')
          : null;
        console.log(converted);
        let audio = {
          [cht.cmd === 'ytmp4' || isDl
            ? 'video'
            : cht.cmd === 'ytmp3'
              ? 'document'
              : 'audio']: isDl
            ? { url: converted }
            : await func.getBuffer(data.dlink),
          mimetype:
            isDl || cht.cmd === 'ytmp4'
              ? 'video/mp4'
              : cht.cmd === 'ytmp3'
                ? 'audio/mp3'
                : 'audio/mpeg',
          fileName:
            item.title +
            (cht.cmd === 'ytmp4' || cht.cmd == 'dlvlink' ? '.mp4' : '.mp3'),
          ptt: cht.cmd === 'playvn',
          contextInfo: {
            externalAdReply: {
              title: 'Title: ' + item.title,
              body: 'Channel: ' + item.creator,
              thumbnailUrl: item.thumbnail,
              sourceUrl: item.url,
              mediaUrl:
                'http://ẉa.me/6283110928302?text=Idmsg: ' +
                Math.floor(Math.random() * 100000000000000000),
              renderLargerThumbnail: false,
              showAdAttribution: true,
              mediaType: 2,
            },
          },
        };
        console.log(audio);
        await cht.edit('Sending...', _key);
        await Exp.sendMessage(cht.id, audio, { quoted: cht.reaction || cht });
        await cht.edit('Success...', _key);
        //  fs.unlinkSync(saved);
        //fs.unlinkSync(converted);
      } catch (e) {
        console.log(e);
        cht.reply("Can't download from that url!");
      }
    }
  );

  ev.on(
    {
      cmd: ['facebookdl', 'fb', 'fbdl', 'facebook'],
      listmenu: ['facebookdl'],
      tag: 'downloader',
      urls: {
        msg: true,
        formats: ['facebook', 'fb'],
      },
      energy: 5,
    },
    async ({ urls }) => {
      const _key = keys[sender];
      await cht.edit('```Processing...```', _key);
      let f = (
        await fetch(
          api.xterm.url +
            '/api/downloader/facebook?url=' +
            urls[0] +
            '&key=' +
            api.xterm.key
        ).then((a) => a.json())
      ).data;
      await cht.edit('Sending...', _key);
      Exp.sendMessage(
        id,
        { video: { url: f.urls.sd }, mimetype: 'video/mp4', caption: f.title },
        { quoted: cht.reaction || cht }
      );
    }
  );

  ev.on(
    {
      cmd: ['instagramdl', 'ig', 'igdl', 'instagram'],
      listmenu: ['instagramdl'],
      tag: 'downloader',
      urls: {
        msg: true,
        formats: ['instagram'],
      },
      energy: 5,
    },
    async ({ urls }) => {
      const _key = keys[sender];
      await cht.edit('```Processing...```', _key);
      let f = (
        await fetch(
          api.xterm.url +
            '/api/downloader/instagram?url=' +
            urls[0] +
            '&key=' +
            api.xterm.key
        ).then((a) => a.json())
      ).data;
      let text = '*!-======[ Instagram ]======-!*\n';
      text += `\nTitle: ${f.title}`;
      text += `\nAccount: ${f.accountName}`;
      text += `\nLikes: ${f.likes}`;
      text += `\nComments: ${f.comments}`;
      text += `\nPostTime: ${f.postingTime}`;
      text += `\nPostUrl: ${f.postUrl}`;
      const info = {
        text,
        contextInfo: {
          externalAdReply: {
            title: cht.pushName,
            body: 'Instagram Downloader',
            thumbnailUrl: f.imageUrl,
            sourceUrl: 'https://github.com/Rifza123',
            mediaUrl:
              'http://ẉa.me/6283110928302/' +
              Math.floor(Math.random() * 100000000000000000),
            renderLargerThumbnail: true,
            showAdAttribution: true,
            mediaType: 1,
          },
          forwardingScore: 19,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterName: 'Termai',
            newsletterJid: '120363301254798220@newsletter',
          },
        },
      };
      await Exp.sendMessage(id, info, { quoted: cht.reaction || cht });
      let { content } = f;
      for (let i of content) {
        try {
          await Exp.sendMessage(
            id,
            { [i.type]: { url: i.url } },
            { quoted: cht.reaction || cht }
          );
        } catch (e) {
          console.log(e);
        }
      }
    }
  );

  ev.on(
    {
      cmd: ['gitclone'],
      listmenu: ['gitclone'],
      tag: 'downloader',
      urls: {
        formats: ['github.com'],
        msg: true,
      },
      energy: 2,
    },
    async () => {
      const repo = cht.q.split('https://github.com/')[1]?.replace('.git', '');
      const repoName = repo?.split('/')[1];
      const { default_branch } = await fetch(
        `https://api.github.com/repos/${repo}`
      ).then((res) => res.json());
      const zipUrl = `https://github.com/${repo}/archive/refs/heads/${default_branch}.zip`;
      Exp.sendMessage(
        cht.id,
        {
          document: { url: zipUrl },
          mimetype: 'application/zip',
          fileName: `${repoName}.zip`,
        },
        { quoted: cht.reaction || cht }
      ).catch((e) =>
        cht.reply(
          `[❗LINK ERROR ❗]\n\nExample : ${cht.prefix}${cht.cmd} https://github.com/adiwajshing/baileys.git`
        )
      );
    }
  );

  ev.on(
    {
      cmd: ['youtube', 'ytdl', 'youtubedl', 'youtubedownloader'],
      listmenu: ['youtube'],
      tag: 'downloader',
      badword: true,
      args: 'Harap sertakan url/judul videonya!',
    },
    async ({ args, urls }) => {
      let [url, _type] = args.split(' ');
      let type = _type?.toLowerCase();
      let auds = {
        mp3: 'ytmp3',
        m4a: 'ytm4a',
        audio: 'ytm4a',
        vn: 'playvn',
      };
      let videos = {
        mp4: 'ytmp4',
        video: 'ytmp4',
      };

      let audio = auds[type];
      let video = videos[type];
      console.log({ video, audio });
      if (!type) {
        memories.setItem(sender, 'questionCmd', {
          emit: `${cht.cmd} ${urls[0]}`,
          exp: Date.now() + 15000,
          accepts: [Object.keys(auds), Object.keys(videos)].flat(),
        });
        return cht.reply('audio/video?');
      }
      cht.cmd = audio || video;
      ev.emit(audio || video);
    }
  );
}
