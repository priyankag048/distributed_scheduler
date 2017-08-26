const Status = {
    success : 200,
    created : 201,
    not_found : 404,
    not_able_to_process : 422
};

const ResponseText = {
    record_created : "Record has been successfully created with id",
    record_modified : "Record has been successfully updated",
    record_deleted : "Record has been successfully deleted", 
    record_exists :"Record with the given id already exists. Please try with a different id",
    record_not_available : "Record with the given id does not exists",
    record_found : "Found job with id"
 };

exports.Status = Status;
exports.ResponseText = ResponseText;

module.exports = exports;