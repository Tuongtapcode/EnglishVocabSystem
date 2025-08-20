package com.nnt.englishvocabsystem.configs;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary(){
        return  new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "duqln52pu",
                "api_key", "924291448136996",
                "api_secret", "JdsaVdMKR25NG7w-VRIBB7H2WXk",
                "secure", true));
    }
}