package com.diploma.LAGmodel.dto;

import com.diploma.LAGmodel.model.ObjectEL;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties({"hibernateLazyInitializer"})
public class VirtualPortMapping {
    @JsonProperty("object")
    private ObjectEL object;
    @JsonProperty("portOfVMServer")
    private ObjectEL portOfVMServer;
    @JsonProperty("VMServer")
    private ObjectEL VMServer;
    @JsonProperty("portOfVirtualMachine")
    private ObjectEL portOfVirtualMachine;
    @JsonProperty("VirtualMachine")
    private ObjectEL VirtualMachine;
}
