package com.diploma.LAGmodel.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.NaturalId;

import java.io.Serializable;

@Entity
@Data
@Table(name="reference")
@JsonIgnoreProperties({"hibernateLazyInitializer"})
public class Reference implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "attr_id", unique=true)
    private Long attrId;

    @Column(name = "object_id", unique=true)
    private Long objectId;

    @Column(name = "reference_id", unique=true)
    private Long referenceId;
}
