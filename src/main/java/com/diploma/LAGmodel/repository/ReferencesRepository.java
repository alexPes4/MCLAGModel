package com.diploma.LAGmodel.repository;

import com.diploma.LAGmodel.model.ObjectEL;
import com.diploma.LAGmodel.model.Reference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReferencesRepository extends JpaRepository<Reference, Long> {
    Reference getReferenceByAttrIdAndAndObjectId(Long attrId, Long objectId);
    void deleteAllByObjectId(Long objectId);
}
