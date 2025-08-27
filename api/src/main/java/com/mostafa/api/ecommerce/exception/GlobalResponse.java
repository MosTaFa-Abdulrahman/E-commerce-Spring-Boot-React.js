package com.mostafa.api.ecommerce.exception;

import lombok.Getter;

import java.util.List;


@Getter
public class GlobalResponse<T> {
    public final static String Error = "error";
    public final static String SUCCESS = "success";

    private final String status;
    private final T data;
    private final List<ErrorItem> errors;


    //    Constructors
    public GlobalResponse(List<ErrorItem> errors) {
        this.status = Error;
        this.data = null;
        this.errors = errors;
    }

    public GlobalResponse(T data) {
        this.status = SUCCESS;
        this.data = data;
        this.errors = null;
    }


    //    Record
    public record ErrorItem(String message) {
    }

}
