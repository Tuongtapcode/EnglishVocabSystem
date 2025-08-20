package com.nnt.englishvocabsystem.enums;

public enum Level {
    A1("a1"),
    A2("a2"),
    B1("b1"),
    B2("b2"),
    C1("c1"),
    C2("c2");

    private final String value;

    Level(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
