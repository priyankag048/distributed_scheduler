const Status = {
    success : 200,
    created : 201,
    not_found : 404,
    not_able_to_process : 422
};

const ResponseText = {
    Record_Created : "Record has been successfully created with id",
    Record_Modified : "Record has been successfully updated",
    Record_Deleted : "Record has been successfully deleted", 
    Record_Exists :"Record with the given id already exists. Please try with a different id",
    Record_Not_Available : "Record with the given id does not exists",
    Record_Found : "Found job with id"
 };

exports.Status = Status;
exports.ResponseText = ResponseText;

module.exports = exports;