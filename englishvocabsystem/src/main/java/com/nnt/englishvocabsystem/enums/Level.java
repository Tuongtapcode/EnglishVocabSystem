package com.nnt.englishvocabsystem.enums;

public enum Level {
    A1("a1", 1f),
    A2("a2", 1.5f),
    B1("b1", 2f),
    B2("b2", 2.5f),
    C1("c1", 3f),
    C2("c2", 3.5f);

    private final String value;
    private final float sm2Value;

    Level(String value, float sm2Value) {
        this.value = value;
        this.sm2Value = sm2Value;
    }

    public String getValue() {
        return value;
    }

    public float getSm2Value() {
        return sm2Value;
    }
}
