package com.elms.leaverequest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RejectLeaveRequest {

    @NotBlank(message = "Manager comment is required for rejection")
    @Size(min = 3, max = 500, message = "Manager comment must be between 3 and 500 characters")
    private String comment;

    public RejectLeaveRequest() {
    }

    public RejectLeaveRequest(String comment) {
        this.comment = comment;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
