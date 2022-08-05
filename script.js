let views_p
let likes_span
let channel_views
let url_id = ''

function get_views_word(views) {
    let views_last_char = views.toString().at(-1);
    if (views >= 11 && views <= 14)
        return 'просмотров'
    else if (views_last_char === '1')
        return 'просмотр'
    else if ('234'.includes(views_last_char))
        return 'просмотра'
    return 'просмотров'
}

function add_views_to_video(views) {
    if (views_p === undefined) {
        views_p = document.createElement('p')
        document.getElementsByClassName('video-pageinfo-container-module__pageHeaderRow')[0].after(views_p)
    }
    views_p.textContent = `${views} ${get_views_word(views)}`
}

function add_likes_to_video(likes) {
    if (likes_span === undefined) {
        let like_button = document.getElementsByClassName('pen-share-button pen-share-button__top')[0]
        like_button.addEventListener('click', () => {
            setTimeout(() => update_likes_on_video(), 250)
        })
        likes_span = document.createElement('span')
        like_button.insertBefore(likes_span, like_button.firstChild)
    }
    likes_span.innerHTML = `${likes}&nbsp;&nbsp;`
}

function update_views_on_video() {
    let video_data_url = 'https://rutube.ru/pangolin/api/web/video/' + url_id;
    fetch(video_data_url).then(data => data.json().then(json_data => {
        let video_data = json_data.result.video
        add_views_to_video(video_data.hits)
    }))
}

function update_likes_on_video() {
    let video_rating_url = 'https://rutube.ru/api/rating/video/' + url_id;
    fetch(video_rating_url).then(data => data.json().then(json_data => {
        add_likes_to_video(json_data.likes)
    }))
}



function update_video_page() {
    update_views_on_video()
    update_likes_on_video()
}

function add_views_to_channel(views) {
    if (channel_views === undefined) {
        channel_views = document.createElement('p')
        const class_name = 'pen-feed-banner__subs'
        channel_views.className = class_name
        channel_views.style.paddingTop = '5px'
        let channel_info = document.getElementsByClassName(class_name)[0]
        channel_info.after(channel_views)
    }
    channel_views.innerHTML = `${views} ${get_views_word(views)}`
}

function update_views_on_channel() {
    let channel_info_url = 'https://studio.rutube.ru/api/profile/user/' + url_id
    fetch(channel_info_url).then(data => data.json().then(json_data => {
        add_views_to_channel(json_data.hits)
    }))
}

function update_channel_page() {
    update_views_on_channel()
}

function get_videos_views(channel_id) {
    let video_id_views = {}
    fetch(`https://rutube.ru/api/video/person/${channel_id}/`).then(data => data.json().then(data_json => {
        data_json.results.forEach(item => {
            video_id_views[item.id] = item.hits
        })
        console.log(video_id_views)
    }))
}

function get_videos_divs() {
    let video_divs = Array.from(document.getElementsByClassName('wdp-card-description-module__descriptionWrapper wdp-card-description-module__fullwidthDescription')).slice(0, 4)
    video_divs.forEach(item => {
        console.log(item.childNodes[0].href)
    })
}

let current_video = ''
let current_channel = ''

function update_pages() {
    url_id = location.href.split('/').at(-2)
    if (window.location.href.includes('rutube.ru/video/')) {
        if (current_video !== url_id) {
            current_video = url_id
            setTimeout(() => update_video_page(), 250)
        }
    } else {
        views_p = undefined
        likes_span = undefined
        current_video = ''
    }
    if (window.location.href.includes('rutube.ru/channel/')) {
        if (current_channel !== url_id) {
            current_channel = url_id
            setTimeout(() => update_channel_page(), 250)
        }
    } else {
        channel_views = undefined
        current_channel = ''
    }
}

window.onload = function () {
    update_pages()
}

const config = {attributes: false, childList: true, subtree: false}
const observer = new MutationObserver(update_pages)
observer.observe(document.body, config)


