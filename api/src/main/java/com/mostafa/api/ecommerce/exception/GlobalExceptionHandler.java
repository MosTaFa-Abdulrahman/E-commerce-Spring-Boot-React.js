package com.mostafa.api.ecommerce.exception;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.List;


@ControllerAdvice
public class GlobalExceptionHandler {
    //    When URL Not Found
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<?> handleExceptionHandler(NoResourceFoundException ex) {
        List<GlobalResponse.ErrorItem> errors = List.of(
                new GlobalResponse.ErrorItem("Resource Not Found")
        );

        return new ResponseEntity<>(new GlobalResponse<>(errors), HttpStatus.NOT_FOUND);
    }


    //    When Data Not Found
    @ExceptionHandler(CustomResponseException.class)
    public ResponseEntity<?> handleCustomResException(CustomResponseException ex) {
        List<GlobalResponse.ErrorItem> errors = List.of(
                new GlobalResponse.ErrorItem(ex.getMessage())
        );
        return new ResponseEntity<>(new GlobalResponse<>(errors), HttpStatus.resolve(ex.getCode()));
    }


    //    When User Send ((Shortage Data)) Validation
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationException(MethodArgumentNotValidException ex) {
        List<GlobalResponse.ErrorItem> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> new GlobalResponse.ErrorItem(err.getField() + " " + err.getDefaultMessage()))
                .toList();

        return new ResponseEntity<>(new GlobalResponse<>(errors), HttpStatus.BAD_REQUEST);
    }
}
