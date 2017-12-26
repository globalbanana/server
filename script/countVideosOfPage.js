
import dayJson from '../pageId/day.json'
import weekJson from '../pageId/week.json'
import saerchLargeJson from '../pageId/saerchLarge.json'
import {initDB, videoList, videoCount} from '../module/dataBase'

import PageModel from '../module/dataBase/page'

(async function () {
    initDB()

    const getAllPage = () => PageModel.getList({limit: 999})
    const getVideoCountByPageFBId = (fbPageId, status) => 
        (!status)?videoCount({fbPageId}) : videoCount({fbPageId, status})
    const updateVideoCountObjById = (_id, countObj) => {
        const payload = {
            videoCount: countObj,
            videoCountHistory: [countObj]
        }
        return PageModel.updateById(_id, payload)
    }


    const allPageList = await getAllPage()

    for(let pageItem of allPageList) {
        const {fbPageId} = pageItem
        const videoCountResult = await getVideoCountByPageFBId(fbPageId)
        const readyVideoCountResult = await getVideoCountByPageFBId(fbPageId, 'READY')        
        const newVideoCountResult = await getVideoCountByPageFBId(fbPageId, 'NEW')
        const editingVideoCountResult = await getVideoCountByPageFBId(fbPageId, 'EDITING')
        const deleteVideoCountResult = await getVideoCountByPageFBId(fbPageId, 'DELETED')
        const publishVideoCountResult = await getVideoCountByPageFBId(fbPageId, 'PUBLISHED')

        const countObj = {
            total: videoCountResult,
            new: newVideoCountResult,
            editing: editingVideoCountResult,
            ready: readyVideoCountResult,
            published: publishVideoCountResult,
            deleted: deleteVideoCountResult
        }

        await updateVideoCountObjById(pageItem._id, countObj)

        console.log(`${pageItem._id} : ${pageItem.fbName} has 
            ${videoCountResult} videos, 
            ${newVideoCountResult} new videos,
            ${editingVideoCountResult} editing videos,
            ${readyVideoCountResult} ready videos,
            ${deleteVideoCountResult} delete videos,
            ${publishVideoCountResult} publish videos,`)      
        
    }

    
    process.exit()
}())