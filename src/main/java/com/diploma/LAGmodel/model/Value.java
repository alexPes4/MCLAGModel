package com.diploma.LAGmodel.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Entity
@Data
@Table(name="values")
@JsonIgnoreProperties({"hibernateLazyInitializer"})
public class Value implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "attr_id", unique=true)
    private Long attrId;

    @Column(name = "object_id", unique=true)
    private Long objectId;

    @Column(name = "value", unique=true)
    private String value;
}
