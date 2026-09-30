package com.elms.leaverequest.dto;

import jakarta.validation.constraints.Size;

public class ApproveLeaveRequest {

    @Size(max = 500, message = "Manager comment cannot exceed 500 characters")
    private String comment;

    public ApproveLeaveRequest() {
    }

    public ApproveLeaveRequest(String comment) {
        this.comment = comment;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
