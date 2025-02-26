import { ChatHistory } from './ai-chatbot.model';
import { AiChatbotService } from './ai-chatbot.service';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'ai-chatbot',
  templateUrl: './ai-chatbot-component.html',
  styleUrls: ['./ai-chatbot-component.scss']
})
export class AiChatbotComponent implements OnInit {

  chatBotIcon!: string;
  arrowDownIcon!: string;
  arrowUpIcon!: string;
  chatIcon!: string;
  message!: string;
  showChat!: boolean;
  chatHistory: ChatHistory[] = [];

  @ViewChild('chatBody') chatBody!: ElementRef;

  constructor(
    private aiChatbotService: AiChatbotService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.chatBotIcon = this.aiChatbotService.getChatbotIcon();
    this.arrowDownIcon = this.aiChatbotService.getDownArrowIcon();
    this.arrowUpIcon = this.aiChatbotService.getUpArrowIcon();
    this.chatIcon = this.aiChatbotService.getChatIcon();
  }

  private scrollToBottom(smooth: boolean): void {
    this.chatBody.nativeElement.scrollTo({
      top: this.chatBody.nativeElement.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }

  onSubmit(event: Event) {
    this.scrollToBottom(false); // No smooth scroll for user message
    event.preventDefault();
    if (!this.message.trim()) return;

    //Clear value of submit
    const newMessage = this.message;
    this.message = '';

    this.chatHistory = [...this.chatHistory, { role: "user", text: newMessage }];

    //Bot thinking
    setTimeout(() => {
      this.chatHistory = [...this.chatHistory, { role: "model", text: "Thinking..." }];// Clean up the "Thinking..." placeholder
      this.cdRef.detectChanges();  // Manually trigger change detection
      this.scrollToBottom(false); // No smooth scroll while thinking
      this.generateRequest(this.chatHistory);
    }, 600);
  }

  private generateRequest(history: any) {
    history = history.filter((msg: any) => msg.text !== "Thinking...");

    // Prepare request payload for API
    const payload = history.map(({ role, text }: any) => [{ role, parts: [{ text }] }]);
    this.generateBotResponse({ contents: payload });
  }

  private async generateBotResponse(requestOptions: any) {
    this.aiChatbotService.generateResponse(requestOptions).subscribe({
      next: (res) => { 
        const geminiResponseText = res.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        this.chatHistory = [...this.chatHistory.filter(msg => msg.text !== "Thinking..."), { role: "model", text: geminiResponseText }];
      },
      error: (error) => { console.log(error) },
      complete: () => {
        this.cdRef.detectChanges();  // Manually trigger change detection
        this.scrollToBottom(true); // Smooth scroll when bot response is complete
      }
    });
  }

}
