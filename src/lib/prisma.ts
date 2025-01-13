import { PrismaClient } from "@prisma/client";

/**
 * Classe para gerenciar a instância do Prisma Client.
 * Utiliza o padrão Singleton para evitar múltiplas instâncias.
 */
class PrismaSingleton {
  private static instance: PrismaClient;

  /**
   * Retorna a instância única do Prisma Client.
   * Cria uma nova instância apenas se ainda não existir.
   */
  public static getInstance(): PrismaClient {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaClient({
        log:
          process.env.NODE_ENV === "development"
            ? ["query", "warn"]
            : ["error"],
      });

      // Configuração para garantir uma única instância no modo de desenvolvimento
      if (process.env.NODE_ENV !== "production") {
        const globalForPrisma = global as unknown as { prisma?: PrismaClient };
        if (!globalForPrisma.prisma) {
          globalForPrisma.prisma = PrismaSingleton.instance;
        }
        PrismaSingleton.instance = globalForPrisma.prisma;
      }
    }

    return PrismaSingleton.instance;
  }
}

// Exporta a instância única do Prisma
export const prisma = PrismaSingleton.getInstance();
