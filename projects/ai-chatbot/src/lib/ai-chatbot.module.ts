import { ModuleWithProviders, NgModule } from '@angular/core';
import { AiChatbotComponent } from './ai-chatbot.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AI_CHATBOT_API_KEY } from './chatbot.tokens';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    AiChatbotComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    AiChatbotComponent
  ]
})
export class AiChatbotModule {
  static forRoot(apiKey: string): ModuleWithProviders<AiChatbotModule> {
    return {
      ngModule: AiChatbotModule,
      providers: [
        { provide: AI_CHATBOT_API_KEY, useValue: apiKey }
      ]
    };
  }
}
