package com.bandongho.configs;

import com.bandongho.entities.Category;
import com.bandongho.entities.Product;
import com.bandongho.entities.User;
import com.bandongho.repositories.CategoryRepository;
import com.bandongho.repositories.ProductRepository;
import com.bandongho.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Chỉ tạo dữ liệu mẫu nếu database trống
        if (categoryRepository.count() == 0) {
            initializeData();
        }
    }

    private void initializeData() {
        // Tạo Categories
        Category luxury = new Category();
        luxury.setName("Luxury");
        luxury.setDescription("Đồng hồ cao cấp");
        luxury = categoryRepository.save(luxury);

        Category sports = new Category();
        sports.setName("Sports");
        sports.setDescription("Đồng hồ thể thao");
        sports = categoryRepository.save(sports);

        Category smart = new Category();
        smart.setName("Smart");
        smart.setDescription("Đồng hồ thông minh");
        smart = categoryRepository.save(smart);

        Category casual = new Category();
        casual.setName("Casual");
        casual.setDescription("Đồng hồ thường ngày");
        casual = categoryRepository.save(casual);

        // Tạo Products
        Product p1 = new Product();
        p1.setName("Classic Elegance");
        p1.setDescription("Timeless sophistication with Swiss precision. A watch that never goes out of style.");
        p1.setPrice(new BigDecimal("2990000"));
        p1.setStock(100);
        p1.setImageUrl("/luxury-watch-classic-design.jpg");
        p1.setRating(4.8);
        p1.setReviews(142);
        p1.setCategory(luxury);
        productRepository.save(p1);

        Product p2 = new Product();
        p2.setName("Urban Explorer");
        p2.setDescription("Durable and stylish, perfect for your everyday adventures.");
        p2.setPrice(new BigDecimal("1990000"));
        p2.setStock(80);
        p2.setImageUrl("/sports-watch-modern-design.jpg");
        p2.setRating(4.6);
        p2.setReviews(89);
        p2.setCategory(sports);
        productRepository.save(p2);

        Product p3 = new Product();
        p3.setName("Tech Titan");
        p3.setDescription("Cutting-edge technology meets classic design.");
        p3.setPrice(new BigDecimal("4490000"));
        p3.setStock(60);
        p3.setImageUrl("/smartwatch-technology.jpg");
        p3.setRating(4.7);
        p3.setReviews(234);
        p3.setCategory(smart);
        productRepository.save(p3);

        Product p4 = new Product();
        p4.setName("Retro Vibes");
        p4.setDescription("Nostalgic charm with modern reliability.");
        p4.setPrice(new BigDecimal("1790000"));
        p4.setStock(90);
        p4.setImageUrl("/vintage-retro-watch.jpg");
        p4.setRating(4.5);
        p4.setReviews(67);
        p4.setCategory(casual);
        productRepository.save(p4);

        Product p5 = new Product();
        p5.setName("Ocean Deep");
        p5.setDescription("Water resistant to 300m. Built for divers and adventurers.");
        p5.setPrice(new BigDecimal("3490000"));
        p5.setStock(70);
        p5.setImageUrl("/diving-watch-water-resistant.jpg");
        p5.setRating(4.9);
        p5.setReviews(156);
        p5.setCategory(sports);
        productRepository.save(p5);

        Product p6 = new Product();
        p6.setName("Golden Hour");
        p6.setDescription("Premium materials and exceptional craftsmanship.");
        p6.setPrice(new BigDecimal("5990000"));
        p6.setStock(50);
        p6.setImageUrl("/gold-luxury-watch-premium.jpg");
        p6.setRating(5.0);
        p6.setReviews(198);
        p6.setCategory(luxury);
        productRepository.save(p6);

        Product p7 = new Product();
        p7.setName("Night Runner");
        p7.setDescription("Lightweight and ergonomic for active lifestyles.");
        p7.setPrice(new BigDecimal("2490000"));
        p7.setStock(85);
        p7.setImageUrl("/black-sports-watch-design.jpg");
        p7.setRating(4.6);
        p7.setReviews(112);
        p7.setCategory(sports);
        productRepository.save(p7);

        Product p8 = new Product();
        p8.setName("Minimal Art");
        p8.setDescription("Less is more. Elegant simplicity at its finest.");
        p8.setPrice(new BigDecimal("2190000"));
        p8.setStock(75);
        p8.setImageUrl("/minimalist-watch-design-art.jpg");
        p8.setRating(4.7);
        p8.setReviews(88);
        p8.setCategory(casual);
        productRepository.save(p8);

        // Tạo Admin User
        User admin = new User();
        admin.setEmail("admin@bandongho.com");
        admin.setPassword("admin123");
        admin.setFullName("Admin User");
        admin.setPhone("0123456789");
        admin.setAddress("Admin Address");
        admin.setRole(User.UserRole.ADMIN);
        userRepository.save(admin);

        System.out.println("=== Data initialized successfully ===");
    }
}

