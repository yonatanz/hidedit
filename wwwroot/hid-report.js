var HIDReportType = {
    name: "HIDReportType",
    Input:      { value: 0, name: "Input" },
    Output:     { value: 1, name: "Output" },
    Feature:    { value: 2, name: "Feature" },
};

function HIDReport(type, data, state) {
    this.type = type;
    this.data = data;
    this.state = state.clone();
}

HIDReport.prototype.makeDescription = function () {
    // #### Todo: Parse data bits and return them as human readable string
    return this.data;
};
