package com.diploma.LAGmodel.dto;

import com.diploma.LAGmodel.model.ObjectEL;
import com.diploma.LAGmodel.model.Reference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties({"hibernateLazyInitializer"})
public class MCLAGModel {
    @JsonProperty("object")
    private ObjectEL object;
    @JsonProperty("status")
    private String status;
    @JsonProperty("locA")
    private ObjectEL locA;
    @JsonProperty("locZ")
    private ObjectEL locZ;

    @JsonProperty("endPoints")
    private List<PathElement> endPoints;

    @JsonProperty("pathElements")
    private List<PathElement> pathElements;
}
