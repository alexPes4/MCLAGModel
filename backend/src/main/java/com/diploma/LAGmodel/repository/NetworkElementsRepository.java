package com.diploma.LAGmodel.repository;

import com.diploma.LAGmodel.model.ObjectEL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NetworkElementsRepository extends JpaRepository<ObjectEL, Long> {
}
