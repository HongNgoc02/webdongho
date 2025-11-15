package com.bandongho.services;

import com.bandongho.dtos.ProductDTO;

import java.util.List;

public interface ProductService {
    ProductDTO createProduct(ProductDTO productDTO);
    ProductDTO updateProduct(Long id, ProductDTO productDTO);
    ProductDTO getProductById(Long id);
    List<ProductDTO> getAllProducts();
    List<ProductDTO> getProductsByCategory(Long categoryId);
    List<ProductDTO> searchProducts(String keyword);
    List<ProductDTO> searchProductsByCategory(Long categoryId, String keyword);
    void deleteProduct(Long id);
    boolean hasOrders(Long productId);
}

