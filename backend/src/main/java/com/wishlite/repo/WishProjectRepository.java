package com.wishlite.repo;

import com.wishlite.model.WishProject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishProjectRepository extends JpaRepository<WishProject, Long> {
    List<WishProject> findByUserIdOrderByUpdatedAtDesc(Long userId);
    Optional<WishProject> findByShareCode(String shareCode);
}
