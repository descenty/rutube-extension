let views_p

function add_views_to_page(views) {
    let views_last_char = views.toString().at(-1);
    let views_word;
    if (views_last_char === '1')
        views_word = 'просмотр'
    else if ('234'.includes(views_last_char))
        views_word = 'просмотра'
    else
        views_word = 'просмотров'
    views_p.textContent = `${views} ${views_word}`
}

function update_video_page() {
    var url = 'https://rutube.ru/pangolin/api/web/video/' + location.href.split('/').at(-2)
    fetch(url).then(data => data.json().then(json_data => {
        if (views_p === undefined) {
            views_p = document.createElement('p')
            document.getElementsByClassName('video-pageinfo-container-module__pageHeaderRow')[0].after(views_p)
        }
        add_views_to_page(json_data.result.video.hits)
    }))

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

window.onload = function () {
    if (window.location.href.includes('rutube.ru/video/')) {
        update_video_page()
    } else if (window.location.href.includes('rutube.ru/channel/')) {
        get_videos_divs()
    }
    console.log(window.reduxState)
    /*
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.target.className === 'pen-page-header_video-options-header-middle pen-page-header_color-default pen-page-header_size-default')
                update_video_page()
        });
    });
    const config = {
        childList: true,
        subtree: true,
    };
    observer.observe(document.body, config);
    */
}

let delay = false;

function observerCallback() {
    if (!delay) {
        delay = true
        setTimeout(() => delay = false, 500)
        if (window.location.href.includes('rutube.ru/video/')) {
            setTimeout(() => update_video_page(), 100)
        } else {
            views_p = undefined
        }
        if (window.location.href.includes('rutube.ru/channel/')) {
            get_videos_divs()
        } else {

        }
    }
}

const config = {attributes: false, childList: true, subtree: false}
const observer = new MutationObserver(observerCallback)
observer.observe(document.body, config)


