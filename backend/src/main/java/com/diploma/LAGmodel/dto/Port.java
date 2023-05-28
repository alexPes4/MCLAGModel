package com.diploma.LAGmodel.dto;

import com.diploma.LAGmodel.model.ObjectEL;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties({"hibernateLazyInitializer"})
public class Port {
    @JsonProperty("objectObj")
    private ObjectEL objectObj;
    @JsonProperty("locationObj")
    private ObjectEL locationObj;
    @JsonProperty("deviceObj")
    private ObjectEL deviceObj;
    @JsonProperty("interfacesObj")
    private ObjectEL interfacesObj;
    @JsonProperty("circuitObj")
    private ObjectEL circuitObj;
    @JsonProperty("vpmsList")
    private List<ObjectEL> vpmsList;
}
