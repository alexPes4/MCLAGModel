package com.diploma.LAGmodel.dto;

import com.diploma.LAGmodel.model.ObjectEL;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties({"hibernateLazyInitializer"})
public class PathElement {
    @JsonProperty("object")
    private ObjectEL object;
    @JsonProperty("carrier")
    private ObjectEL carrier;
    @JsonProperty("resource")
    private ObjectEL resource;
}
