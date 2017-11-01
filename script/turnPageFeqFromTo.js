import PageModel from '../module/dataBase/page'
import {initDB} from '../module/dataBase';
var colors = require('colors');

(async function () {
    try {
        initDB()

        const feqList = PageModel.config.feqList
        const matchFeq = _pageFeq => _i => _i === _pageFeq

        const pageId = process.argv[2]
        let pageName = ''
        let _id = ''
        const fromFeq = process.argv[3]
        const toFeq = process.argv[4]
        
        const getPageById = fbPageId => PageModel.getList({}, {fbPageId})
        const getPageByName = fbName => PageModel.getList({}, {fbName})
        const getPageByNameThenId = async (input) => {
            const returnData = await getPageByName(input)
            if(returnData && returnData.legnth>=1) 
                return returnData;
            else 
                return await getPageById(input)
        }
        const updatePageFeqById = (fbPageId, feq) => PageModel.updateById(fbPageId, {feq})
        
        if (!pageId || !fromFeq || !toFeq) 
            throw new Error('Missed required arg: npm run changePageFeq PAGEID FROM_FEQ TO_FEQ');
            
        if (!feqList.some(matchFeq(fromFeq)) || !feqList.some(matchFeq(toFeq))) 
            throw new Error('Error: value of feq is incorrect : could be :' + JSON.stringify(feqList))
            
        const pageObj = (await getPageByNameThenId(pageId))[0]
        _id = pageObj._id
        pageName = pageObj.fbName

        if (pageObj.feq !== fromFeq) 
            throw new Error(`Error: feq pageObj dose not match given feq : ${fromFeq} !=== ${pageObj.feq}`)

        const updatedPageObj = await updatePageFeqById(_id, toFeq)
        
        console.log(colors.green(`  update page ${pageName}:${pageId} from feq ${fromFeq} -> ${toFeq} done`))

        process.exit()

    } catch (err) {
        console.error(colors.red(err))
        process.exit()
    }
}())
