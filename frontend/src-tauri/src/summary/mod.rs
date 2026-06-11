/// Summary module - handles all meeting summary generation functionality
///
/// This module contains:
/// - LLM client for communicating with various AI providers (OpenAI, Claude, Groq, Ollama, OpenRouter)
/// - Processor for chunking transcripts and generating summaries
/// - Service layer for orchestrating summary generation
/// - Templates for structured meeting summary generation
/// - Tauri commands for frontend integration

pub mod commands;
pub mod llm_client;
pub mod processor;
pub mod service;
pub mod template_commands;
pub mod templates;

// Re-export Tauri commands and template commands
pub use commands::*;
pub use template_commands::*;

// Re-export commonly used items
pub use llm_client::LLMProvider;
pub use processor::{
    chunk_text, clean_llm_markdown_output, extract_meeting_name_from_markdown,
    generate_meeting_summary, rough_token_count,
};
pub use service::SummaryService;
