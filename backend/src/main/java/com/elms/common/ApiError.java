package com.elms.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiError {

    private String code;
    private String message;
    private List<ErrorDetail> details;

    public ApiError() {
        this.details = new ArrayList<>();
    }

    public ApiError(String code, String message) {
        this.code = code;
        this.message = message;
        this.details = new ArrayList<>();
    }

    public ApiError(String code, String message, List<ErrorDetail> details) {
        this.code = code;
        this.message = message;
        this.details = details != null ? details : new ArrayList<>();
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<ErrorDetail> getDetails() {
        return details;
    }

    public void setDetails(List<ErrorDetail> details) {
        this.details = details;
    }

    public void addDetail(String field, String message) {
        if (this.details == null) {
            this.details = new ArrayList<>();
        }
        this.details.add(new ErrorDetail(field, message));
    }
}
