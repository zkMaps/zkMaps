import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({
  deployments: { deploy },
  getNamedAccounts,
}) => {
  const { deployer } = await getNamedAccounts();
  await deploy("VerifierRayTracing10", {
    from: deployer,
    log: true,
    waitConfirmations: 2,
  });
};

func.tags = ["VerifierRayTracing10"];

export default func;
