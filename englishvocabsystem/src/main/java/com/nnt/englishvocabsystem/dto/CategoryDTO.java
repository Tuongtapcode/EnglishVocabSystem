package com.nnt.englishvocabsystem.dto;

public class CategoryDTO {
    private Integer id;
    private String name;
    private String description;
    private String image;
    private Boolean isActive;

    public CategoryDTO() {

    }

    public CategoryDTO(Integer id, String name, String description, String image, Boolean isActive) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
        this.isActive = isActive;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }
}
