import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({
  deployments: { deploy },
  getNamedAccounts,
}) => {
  const { deployer } = await getNamedAccounts();
  await deploy("VerifierRayTracing6Private", {
    args: [],
    from: deployer,
    log: true,
  });
};

func.tags = ["Verifier"];

export default func;
