import { agentAnalyses, multiAgentMessages } from '../mocks/multiAgentChat.mock';

export async function getMultiAgentWorkspace() {
  return {
    analyses: agentAnalyses,
    messages: multiAgentMessages,
  };
}
