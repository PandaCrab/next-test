export const setViewedStuff = (_id) => {
    const viewedStuff = JSON.parse(sessionStorage.getItem('viewed'));

    if (viewedStuff && viewedStuff.length) {
        if (viewedStuff.includes(_id)){
            return;
        }

        if (!viewedStuff.includes(_id)) {
            viewedStuff.push({ _id });
            return sessionStorage.setItem('viewed', JSON.stringify(viewedStuff));
        }
    }

    if (!viewedStuff) {
        return sessionStorage.setItem('viewed', JSON.stringify([{ _id }]));
    }
};
