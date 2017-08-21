/**
 * Created by harekam on 18/08/17.
 */
'use strict';
/*
 ----------------------------------------
 GET DATA
 ----------------------------------------
 */
function getData(model, query, projection, options, callback) {
    model.find(query, projection, options, (err, data) => {
        if (err) {
            console.error("Get Data", err);
            return callback(err);
        }
        return callback(null, data);
    });
}

/*
 ----------------------------------------
 AGGREGATE DATA
 ----------------------------------------
 */
function aggregateData(model, group, callback) {
    model.aggregate(group, (err, data) => {

        if (err) {
            console.error("Aggregate Data", err);
            return callback(err);
        }
        return callback(null, data);
    });
}
/*
 ----------------------------------------
 AGGREGATE DATA
 ----------------------------------------
 */
function aggregateDataWithPopulate(model, group, populateOptions, callback) {
    model.aggregate(group, (err, data) => {

        if (err) {
            console.error("Aggregate Data", err);
            return callback(err);
        }

        model.populate(data, populateOptions,
            function (err1, populatedDocs) {

                if (err1) return callback(err1);
                return callback(null, populatedDocs); // This object should now be populated accordingly.
            });
        //return callback(null, data);
    });
}


/*
 ----------------------------------------
 SET DATA
 ----------------------------------------
 */
function setData(model, data, callback) {

    new model(data).save((err, resultData) => {

        if (err) {
            console.error("SET DATA: ", err);
            return callback(err);
        }

        let result = resultData.toObject();
        delete result.__v;
        callback(null, result);

    });
}
/*
 ----------------------------------------
 SET MANY DATA
 ----------------------------------------
 */
function insertMany(model, data, callback) {

    model.insertMany(data, (err, resultData) => {

        if (err) {
            console.error("INSERT MANY DATA: ", err);
            return callback(err);
        }
        return callback(null, resultData);

    });
}


/*
 ----------------------------------------
 DELETE DATA
 ----------------------------------------
 */
function deleteData(model, conditions, callback) {

    model.deleteMany(conditions, (err, removed) => {

        if (err) {
            console.error("Delete Data", err);
            return callback(err);
        }
        return callback(null, removed.result);


    });
}

/*
 ----------------------------------------
 BATCH INSERT
 ----------------------------------------
 */
function batchInsert(model, batchData, options, callback) {
    model.collection.insert(batchData, options, (error, docs) => {

        if (error) {
            console.error("Batch insert:", error);
            return callback(error);
        }

        return callback(null, docs);

    });
}


function getCount(model, condition, callback) {
    model.count(condition, (error, count) => {
        if (error) {
            console.error("Error Get Count: ", error);
            return callback(error);
        }
        return callback(null, count);
    })
}

/*
 ----------------------------------------
 UPDATE DATA
 ----------------------------------------
 */
function update(model, conditions, updateData, options, callback) {
    model.update(conditions, updateData, options, (err, result) => {

        if (err) {
            console.error("Update Query: ", err);
            return callback(err);
        }
        return callback(null, result);

    });
}

/*
 ---------------------------------------------------------------------------------------------
 WARNING: Not a general module just for category-sub-service tree or for three level tree only
 ---------------------------------------------------------------------------------------------
 */
function getDataDeepPopulateThreeLevel(model, query, projectionQuery, options, populateModel, nestedModel, callback) {

    model.find(query, projectionQuery, options).populate(populateModel)
        .exec((err, docs) => {

            if (err) return callback(err);

            model.populate(docs, nestedModel,
                (err1, populatedDocs) => {
                    if (err1) return callback(err1);
                    callback(null, populatedDocs); // This object should now be populated accordingly.
                });
        });
}
/*
 ---------------------------------------------------------------------------------------------
 WARNING: Not a general module just for category-sub-service-subService tree or for four level tree only
 ---------------------------------------------------------------------------------------------
 */
function getDataDeepPopulateFourLevel(model, query, projectionQuery, options, populateModel, nestedModel, deepNestedModel, callback) {

    model.find(query, projectionQuery, options).populate(populateModel)
        .exec((err, docs) => {

            if (err) return callback(err);

            model.populate(docs, nestedModel,
                (err1, populatedDocs) => {

                    if (err1) return callback(err1);
                    model.populate(populatedDocs, deepNestedModel,
                        (err2, deepPopulatedDocs) => {
                            if (err2) return callback(err2);
                            callback(null, deepPopulatedDocs);
                        });
                });
        });
}

function getDistinctData(model, field, condition, callback) {
    model.distinct(field, condition, (error, result) => {
        if (error) {
            console.error("Distinct Data", error);
            return callback(error);
        }
        return callback(null, result);
    })
}

function findOneAndUpdateData(model, conditions, updateData, options, callback) {
    model.findOneAndUpdate(conditions, updateData, options, (error, result) => {
        if (error) {
            console.error("Find one and update", error);
            return callback(error);
        }
        return callback(null, result);
    })
}

/*
 ----------------------------------------
 GET DATA WITH REFERENCE
 ----------------------------------------
 */
function getDataWithReference(model, query, projection, options, collectionOptions, callback) {
    model.find(query, projection, options).populate(collectionOptions).exec((err, data) => {

        if (err) {
            console.error("Error Data reference: ", err);
            return callback(err);
        }
        return callback(null, data);

    });
}

module.exports = {
    getDataWithReference,
    findOneAndUpdateData,
    getDistinctData,
    getDataDeepPopulateFourLevel,
    getDataDeepPopulateThreeLevel,
    update,
    getCount,
    batchInsert,
    getData,
    aggregateData,
    aggregateDataWithPopulate,
    setData,
    insertMany,
    deleteData
};