
class Abstract {
    constructor(modelName, schemaObject) {
      this.schemaObject = schemaObject
      this.modelName = modelName    
    }

    assignKeyValue (from, to) {
        Object.keys(from).forEach(
            (key) => {
                to[key] = from[key]
            }
        )
    }

    create (payload = {}) {
        return new Promise((resolve, reject) => {
            const _mongoose = global.DBInstance
            const Intance = _mongoose.model(this.modelName, this.schemaObject)
            const _instance = new Intance()
        
            this.assignKeyValue(payload, _instance)
        
            _instance.save(function (err, obj) {
                if (err) reject(err)
                else {
                    resolve(obj)
                }
            })
        })
    }

    getList (payload = {}, field={}, exist={}) {
        return new Promise((resolve, reject) => {
            const _mongoose = global.DBInstance
        
            const _payload = {
                limit: 10,
                skip: 0,
                sort: '-date',
                ...payload
            }
        
            const Intance = _mongoose.model(this.modelName, this.schemaObject)
            const query = Intance.find(field, null, _payload)
        
            Object.keys(exist).forEach((key) => {
                    query.where(key).exists(exist[key])
            })
        
            query.exec(function (err, vObjList) {
                if (err) reject(err)
                resolve(vObjList)
            })
        })
    }

    deleteById (id) {
        return new Promise((resolve, reject) => {
            const _mongoose = global.DBInstance
            const Intance = _mongoose.model(this.modelName, this.schemaObject)
            
            Intance.findByIdAndRemove(id, function (err, vObj) {  
                if (err) reject(err)
                resolve(vObj)
            });
        
        })
    }
}

export default Abstract