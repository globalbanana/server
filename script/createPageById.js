
import dayJson from '../pageId/day.json'
import weekJson from '../pageId/week.json'
import saerchLargeJson from '../pageId/saerchLarge.json'
import {initDB} from '../module/dataBase'
import PageModel from '../module/dataBase/page'

import {getPageDetail as getPageDetailFromFacebook, getAccessToken} from'../module/facebook'

(async function () {
try{

    const feqList = PageModel.config.feqList
    const pageId = process.argv[2]
    const pageFeq = process.argv[3]
    const matchFeq =  _pageFeq => _i => _i ===_pageFeq 

    if(!pageId || !pageFeq)
        throw new Error('Missed required arg: npm run createPage PAGEID FEQ');

    if(!feqList.some(matchFeq(pageFeq)))
        throw new Error('FRQ does not match any of: ' + feqList);
    
    initDB()
    await getAccessToken()

    const isPageExisted = async (pageId) => {
        const field = {fbPageId: pageId}
        return  ((await PageModel.getList({}, field)).length >0)
    }

    const createPageObject = async (_pageObj, _feq) => {
        if(!_pageObj.name)
            return
            
        const countObj = {
            total: 0,
            new: 0,
            editing: 0,
            ready: 0,
            published: 0,
            deleted: 0,
        }

        const _t = {
            ..._pageObj,
            picture: ( _pageObj.picture)?_pageObj.picture.data.url: null,
            fbName: _pageObj.name,
            fbPageId: _pageObj.id,
            fanCount: _pageObj.fan_count,
            talkAboutCount: _pageObj.talking_about_count,
            feq: _feq,
            videoCount: countObj,
            videoCountHistory: [countObj]
        }
        const _result = await PageModel.create(_t)
        return _result
    }

    const createPageObjectByPageId = async (pageId, _feq) => {
        const pageObj = await getPageDetailFromFacebook(pageId)
        const _isPageExisted = await isPageExisted(pageObj.id)

        if(_isPageExisted)
            console.log('SKIP: ', pageObj.name , ' is alreayd in DB. fbPageId:', pageObj)
        else {
            await createPageObject(pageObj, _feq)
            if(pageObj.name)
                console.log(`${pageObj.name} is created : `)
            else 
                console.log(`${pageObj.name} create failed ... `)            
        }
    }

    await createPageObjectByPageId(pageId, pageFeq)
    
    process.exit()    
} catch (err){
    console.error(err)
    process.exit()    
}
}())