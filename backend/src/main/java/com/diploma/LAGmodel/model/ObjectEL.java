package com.diploma.LAGmodel.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Entity
@Data
@Table(name="objects")
@JsonIgnoreProperties({"hibernateLazyInitializer"})
public class ObjectEL implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long objectId;
    @Column(name = "name")
    private String name;
    @Column(name = "type_id")
    private Long typeId;
    @Column(name = "class_id")
    private Long classId;
    @Column(name = "parent_id")
    private Long parentId;
    @Column(name = "description")
    private String description;
    @Column(name = "order_number")
    private Long order;
}
