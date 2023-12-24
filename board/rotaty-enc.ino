#include <ezButton.h>  // the library to use for SW pin

#define CLK_PIN 25 // ESP32 pin GPIO25 connected to the rotary encoder's CLK pin
#define DT_PIN  26 // ESP32 pin GPIO26 connected to the rotary encoder's DT pin
#define SW_PIN  27 // ESP32 pin GPIO27 connected to the rotary encoder's SW pin

int CLK_state;
int prev_CLK_state;

ezButton button(SW_PIN);  

void setup() {
  Serial.begin(9600);

  pinMode(CLK_PIN, INPUT);
  pinMode(DT_PIN, INPUT);
  button.setDebounceTime(50);  

  prev_CLK_state = digitalRead(CLK_PIN);
}

void loop() {
  button.loop(); 

  CLK_state = digitalRead(CLK_PIN);
  
  if (CLK_state != prev_CLK_state && CLK_state == HIGH) {
    if (digitalRead(DT_PIN) == HIGH) {
      Serial.println("Right");
      Serial.write(2);
    } else {
      Serial.println("Left");
      Serial.write(3);
    }
  }

  prev_CLK_state = CLK_state;

  if (button.isPressed()) {
    Serial.println("Button");
    Serial.write(1);
  }
}
