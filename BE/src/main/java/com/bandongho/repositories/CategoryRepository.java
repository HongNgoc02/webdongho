package com.bandongho.repositories;

import com.bandongho.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByName(String name);
    
    @Query("SELECT c FROM Category c WHERE c.name LIKE %:keyword%")
    List<Category> searchByName(@Param("keyword") String keyword);
}

