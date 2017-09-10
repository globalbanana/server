
import dayJson from '../pageId/day.json'
import weekJson from '../pageId/week.json'
import saerchLargeJson from '../pageId/saerchLarge.json'
import {initDB} from '../module/dataBase'
import PageModel from '../module/dataBase/page'

import {getPageDetail as getPageDetailFromFacebook, getAccessToken} from'../module/facebook'

(async function () {
    initDB()
    await getAccessToken()

    const isPageExisted = async (pageId) => {
        const field = {fbPageId: pageId}
        return  ((await PageModel.getList({}, field)).length >0)
    }

    const createPageObject = async (_pageObj, _feq) => {
        if(!_pageObj.name)
            return
            
        const _t = {
            ..._pageObj,
            picture: ( _pageObj.picture)?_pageObj.picture.data.url: null,
            fbName: _pageObj.name,
            fbPageId: _pageObj.id,
            fanCount: _pageObj.fan_count,
            talkAboutCount: _pageObj.talking_about_count,
            feq: _feq
        }
        const _result = await PageModel.create(_t)
        return _result
    }

    const createPageObjectByPageName = async (pageName, _feq) => {
        const pageObj = await getPageDetailFromFacebook(pageName)
        const _isPageExisted = await isPageExisted(pageObj.id)
        if(_isPageExisted)
            console.log('SKIP: ', pageObj.name , ' is alreayd in DB')
        else {
            await createPageObject(pageObj, )
            if(pageObj.name)
                console.log(`${pageObj.name} is created : `)
            else 
                console.log(`${pageObj.name} create failed ... `)            
        }
    }

    for(let pageName of dayJson){
        await createPageObjectByPageName(pageName, 'DAY')
    }

    for(let pageName of weekJson){
        await createPageObjectByPageName(pageName, 'WEEK')
    }

    for(let pageName of saerchLargeJson){
        await createPageObjectByPageName(pageName, 'SEARCH_LARGE')
    }

    process.exit()
}())